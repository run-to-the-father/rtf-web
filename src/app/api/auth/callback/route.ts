import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib';

// OAuth 콜백 처리
export async function GET(request: NextRequest) {
  console.log('OAuth 콜백 라우트 진입');

  // URL에서 코드와 상태 가져오기
  const requestUrl = new URL(request.url);
  console.log('OAuth requestUrl:', requestUrl);

  // 전체 URL 로깅
  console.log('전체 콜백 URL:', request.url);

  // URL 해시(#) 부분 처리 - 해시에 코드가 있을 수 있음
  const urlParts = request.url.split('#');
  let hashParams = null;

  if (urlParts.length > 1) {
    console.log('URL 해시 부분 존재:', urlParts[1]);
    // 해시에 code 파라미터가 있는지 확인
    hashParams = new URLSearchParams(urlParts[1]);
    const hashCode = hashParams.get('code');
    if (hashCode) {
      console.log(
        '해시에서 code 파라미터 발견 (일부):',
        hashCode.substring(0, 10) + '...',
      );
      requestUrl.searchParams.set('code', hashCode);
    }
  }

  // 검색 파라미터 확인
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const errorCode = requestUrl.searchParams.get('error_code');
  const state = requestUrl.searchParams.get('state');

  // state 파라미터에서 redirectTo 추출 (무시하고 항상 홈으로 리다이렉트)
  let redirectTo = '/';

  console.log('OAuth 콜백 파라미터:', {
    hasCode: !!code,
    codePreview: code ? `${code.substring(0, 10)}...` : null,
    hasError: !!error,
    errorCode,
    errorDescription,
    state,
    hashExists: !!hashParams,
    redirectTo,
  });

  // 현재 URL에서 기본 URL 생성
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `${requestUrl.protocol}//${requestUrl.host}`;

  console.log('기본 URL:', baseUrl);

  // 오류 파라미터가 있는 경우
  if (error) {
    console.error('OAuth 오류 파라미터 발견:', error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}/sign-in?error=${error}&error_description=${encodeURIComponent(errorDescription || '')}`,
    );
  }

  // 코드가 없으면 에러 반환
  if (!code) {
    console.error('OAuth 콜백: 코드 없음');
    return NextResponse.redirect(`${baseUrl}/sign-in?error=no_code`);
  }

  try {
    // Supabase 세션 설정 (쿠키 자동 설정됨)
    console.log(
      'OAuth 콜백: 세션 교환 시도 (코드 일부):',
      code.substring(0, 10) + '...',
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth 콜백 오류:', error);
      return NextResponse.redirect(
        `${baseUrl}/sign-in?error=auth_error&details=${encodeURIComponent(error.message)}`,
      );
    }

    // 세션 데이터가 없는 경우
    if (!data?.session || !data.session.user) {
      console.error('OAuth 콜백: 세션 또는 사용자 데이터가 없음');
      return NextResponse.redirect(
        `${baseUrl}/sign-in?error=auth_error&details=No session data returned`,
      );
    }

    // 세션 확인
    console.log('OAuth 콜백: 세션 교환 성공', {
      sessionExists: !!data?.session,
      userId: data?.session?.user?.id,
      user: data?.session?.user?.email,
    });

    try {
      // 사용자 메타데이터 확인 및 업데이트 (필요한 경우)
      const user = data.session.user;
      if (!user.user_metadata || !user.user_metadata.nickname) {
        // 필요한 메타데이터가 없는 경우 기본값으로 설정
        console.log('사용자 메타데이터 업데이트 시도...');
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            nickname: user.email?.split('@')[0] || '사용자',
            gender: 'other',
          },
        });

        if (updateError) {
          console.error('사용자 메타데이터 업데이트 오류:', updateError);
          // 메타데이터 업데이트 실패해도 로그인은 계속 진행
        } else {
          console.log('사용자 메타데이터 업데이트 완료');
        }
      }
    } catch (metadataError) {
      console.error('메타데이터 처리 오류:', metadataError);
      // 메타데이터 오류는 로그인 진행에 영향을 주지 않음
    }

    // 세션 다시 확인 - 메타데이터 업데이트 후
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('최종 사용자 세션 확인:', {
      hasSession: !!sessionData.session,
      userEmail: sessionData.session?.user?.email,
      userMetadata: sessionData.session?.user?.user_metadata,
    });

    // 항상 홈으로 리다이렉트
    const timestamp = Date.now();
    const targetUrl = new URL('/', baseUrl);
    targetUrl.searchParams.set('auth_success', 'true');
    targetUrl.searchParams.set('t', timestamp.toString());

    console.log('성공 리다이렉트 URL:', targetUrl.toString());

    return NextResponse.redirect(targetUrl.toString(), {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('OAuth 콜백 처리 오류:', error);
    return NextResponse.redirect(
      `${baseUrl}/sign-in?error=server_error&details=${encodeURIComponent(error instanceof Error ? error.message : String(error))}`,
    );
  }
}
