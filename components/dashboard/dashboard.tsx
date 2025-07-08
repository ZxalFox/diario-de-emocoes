'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { EmotionLogger } from '@/components/emotions/emotion-logger';
import { EmotionHistory } from '@/components/emotions/emotion-history';
import { WeeklySummary } from '@/components/emotions/weekly-summary';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { Header } from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Clock, Bell, PlusCircle } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('log');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem vindo de volta, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Como está se sentindo hoje?
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
            <TabsTrigger value="log" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Início
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Resumos
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6">
            <EmotionLogger />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <EmotionHistory />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <WeeklySummary />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}