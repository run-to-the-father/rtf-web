import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 현재는 아무 작업도 수행하지 않지만, 미래에 필요한 미들웨어 로직을 여기에 추가할 수 있습니다.
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정 (선택사항)
// export const config = {
//   matcher: ['/api/:path*'],
// };
