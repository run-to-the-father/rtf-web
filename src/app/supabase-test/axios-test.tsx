'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ClientInstance } from '@shared/config/axios/client';
import { Button } from '@shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';

export default function AxiosSupabaseTest() {
  const [connectionData, setConnectionData] = useState<any>(null);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // 직접 axios 라이브러리를 사용한 테스트
  const testConnectionDirect = async () => {
    setConnectionLoading(true);
    setConnectionError(null);
    setDebugInfo(null);

    try {
      // 직접 axios로 호출 (ClientInstance 대신)
      console.log('직접 API 호출 시작...');
      const response = await axios.get('/api/supabase-test', {
        timeout: 10000, // 10초 타임아웃
      });

      const data = response.data;
      console.log('API 응답 데이터:', data);

      if (!data.success) {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다');
      }

      setConnectionData(data);
      setDebugInfo({
        responseStatus: response.status,
        responseHeaders: response.headers,
        fullData: data,
      });
    } catch (error: any) {
      console.error('Supabase 연결 테스트 오류:', error);

      // 디버깅 정보 수집
      const debugData = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
              headers: error.response.headers,
            }
          : 'No response data',
        request: error.request
          ? 'Request exists but no response'
          : 'No request data',
        config: error.config,
      };

      setDebugInfo(debugData);

      // 사용자에게 보여줄 에러 메시지
      let errorMessage = '알 수 없는 오류가 발생했습니다';

      if (error.response) {
        // 서버가 응답을 반환했지만 2xx 범위가 아닌 상태 코드
        errorMessage = `서버 오류 (${error.response.status}): ${error.response.data?.error || error.message}`;
      } else if (error.request) {
        // 요청이 전송되었지만 응답이 없음
        errorMessage = '서버에서 응답이 없습니다. 네트워크를 확인해주세요.';
      } else {
        // 요청 설정 중 에러 발생
        errorMessage = `요청 설정 오류: ${error.message}`;
      }

      setConnectionError(errorMessage);
    } finally {
      setConnectionLoading(false);
    }
  };

  // 컴포넌트 마운트 시 연결 테스트 실행
  useEffect(() => {
    testConnectionDirect();
  }, []);

  return (
    <div className='mt-10'>
      <h2 className='mb-4 text-2xl font-bold'>Axios로 Supabase 연결 테스트</h2>

      <Card>
        <CardHeader>
          <CardTitle>Axios를 통한 연결 상태</CardTitle>
          <CardDescription>
            Axios 라이브러리를 통해 Supabase 서버와의 연결 상태를 확인합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionLoading ? (
            <p>연결 확인 중...</p>
          ) : connectionError ? (
            <div className='text-red-500'>
              <p>오류 발생: {connectionError}</p>
              {debugInfo && (
                <div className='mt-4'>
                  <p className='font-semibold'>디버깅 정보:</p>
                  <pre className='mt-2 max-h-60 overflow-auto rounded bg-gray-100 p-4 text-xs'>
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : connectionData ? (
            <div>
              <p className='font-bold text-green-500'>
                {connectionData.message}
              </p>
              {connectionData.version && (
                <p>Supabase 버전: {connectionData.version}</p>
              )}
              <pre className='mt-4 rounded bg-gray-100 p-4 text-xs'>
                {JSON.stringify(connectionData, null, 2)}
              </pre>
            </div>
          ) : (
            <p>연결 테스트를 실행해주세요</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={testConnectionDirect} disabled={connectionLoading}>
            {connectionLoading ? '테스트 중...' : '연결 테스트'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
