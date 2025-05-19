'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

export default function SupabaseTestPage() {
  const [connectionData, setConnectionData] = useState<any>(null);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);

  // Supabase 연결 테스트
  const testConnection = async () => {
    setConnectionLoading(true);
    setConnectionError(null);

    try {
      const response = await fetch('/api/supabase-test');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다');
      }

      setConnectionData(data);
    } catch (error) {
      setConnectionError(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다',
      );
    } finally {
      setConnectionLoading(false);
    }
  };

  // 메시지 목록 가져오기
  const fetchMessages = async () => {
    setMessagesLoading(true);
    setMessagesError(null);

    try {
      const response = await fetch('/api/messages');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다');
      }

      setMessages(data.messages || []);
    } catch (error) {
      setMessagesError(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다',
      );
    } finally {
      setMessagesLoading(false);
    }
  };

  // 새 메시지 생성
  const createMessage = async () => {
    if (!newMessage.trim()) return;

    setCreating(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다');
      }

      setNewMessage('');
      fetchMessages(); // 메시지 목록 다시 불러오기
    } catch (error) {
      console.error('메시지 생성 오류:', error);
    } finally {
      setCreating(false);
    }
  };

  // 메시지 삭제
  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다');
      }

      fetchMessages(); // 메시지 목록 다시 불러오기
    } catch (error) {
      console.error('메시지 삭제 오류:', error);
    }
  };

  // 컴포넌트 마운트 시 연결 테스트 실행
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Supabase 연결 테스트</h1>

      {/* 연결 테스트 섹션 */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Supabase 연결 상태</CardTitle>
          <CardDescription>
            Supabase 서버와의 연결 상태를 확인합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionLoading ? (
            <p>연결 확인 중...</p>
          ) : connectionError ? (
            <div className='text-red-500'>
              <p>오류 발생: {connectionError}</p>
            </div>
          ) : connectionData ? (
            <div>
              <p className='font-bold text-green-500'>
                {connectionData.message}
              </p>
              <p>서버 시간: {connectionData.serverTime}</p>
            </div>
          ) : (
            <p>연결 테스트를 실행해주세요</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={testConnection} disabled={connectionLoading}>
            {connectionLoading ? '테스트 중...' : '연결 테스트'}
          </Button>
        </CardFooter>
      </Card>

      {/* 메시지 목록 및 생성 섹션 */}
      <Card className='mb-8 mt-10'>
        <CardHeader>
          <CardTitle>메시지 목록</CardTitle>
          <CardDescription>
            저장된 메시지 목록을 확인하고 새 메시지를 작성합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <Textarea
              placeholder='새 메시지 내용을 입력하세요'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className='mb-2'
            />
            <Button
              onClick={createMessage}
              disabled={creating || !newMessage.trim()}
            >
              {creating ? '메시지 생성 중...' : '메시지 추가'}
            </Button>
          </div>

          <div className='mt-6'>
            <Button
              onClick={fetchMessages}
              disabled={messagesLoading}
              variant='outline'
              className='mb-4'
            >
              {messagesLoading ? '불러오는 중...' : '메시지 목록 새로고침'}
            </Button>

            {messagesLoading ? (
              <p>메시지 불러오는 중...</p>
            ) : messagesError ? (
              <div className='text-red-500'>
                <p>오류 발생: {messagesError}</p>
              </div>
            ) : messages.length === 0 ? (
              <p>메시지가 없습니다</p>
            ) : (
              <div className='space-y-4'>
                {messages.map((message) => (
                  <Card key={message.id}>
                    <CardHeader className='py-3'>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='text-sm'>
                          메시지 ID: {message.id}
                        </CardTitle>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => deleteMessage(message.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='py-2'>
                      <p>{message.content}</p>
                    </CardContent>
                    <CardFooter className='py-2 text-xs text-gray-500'>
                      생성: {new Date(message.created_at).toLocaleString()}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
