import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SystemState, PriorityQueue, Booking } from '@/hooks/useRealtimeData';
import { Settings, Users, Clock, Trash2, Play, Square } from 'lucide-react';
import GamesScheduleForm from './GamesScheduleForm';
import { ManualAddForm } from './ManualAddForm';
import { ManualBookingForm } from './ManualBookingForm';
import { AutoScheduleForm } from './AutoScheduleForm';


interface AdminPanelProps {
  systemState: SystemState | null;
  priorityQueue: PriorityQueue[];
  bookings: Booking[];
}

export function AdminPanel({ systemState, priorityQueue, bookings }: AdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateSystemState = async (updates: Partial<SystemState>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('system_state')
        .update(updates)
        .eq('id', systemState?.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar sistema.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Sistema atualizado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const startPriorityTimer = async () => {
    await updateSystemState({
      is_priority_mode: true,
      is_open_for_all: false,
      priority_timer_started_at: new Date().toISOString()
    });
  };

  const openForAll = async () => {
    await updateSystemState({
      is_priority_mode: false,
      is_open_for_all: true,
      priority_timer_started_at: null
    });
  };

  const pauseSystem = async () => {
    await updateSystemState({
      is_priority_mode: false,
      is_open_for_all: false,
      priority_timer_started_at: null
    });
  };

  const clearPriorityQueue = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('priority_queue')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao limpar fila.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Fila de prioridade limpa.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const clearAllBookings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao limpar marcações.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Todas as marcações foram removidas.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Painel do Administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={startPriorityTimer}
              disabled={loading}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              <Clock className="h-4 w-4 mr-2" />
              Iniciar Timer (10min)
            </Button>
            
            <Button
              onClick={openForAll}
              disabled={loading}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              <Play className="h-4 w-4 mr-2" />
              Abrir para Todos
            </Button>
            
            <Button
              onClick={pauseSystem}
              disabled={loading}
              variant="outline"
            >
              <Square className="h-4 w-4 mr-2" />
              Pausar Sistema
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciar Fila
              <Badge variant="outline">{priorityQueue.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={clearPriorityQueue}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Fila de Prioridade
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🏐 Gerenciar Marcações
              <Badge variant="outline">{bookings.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={clearAllBookings}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Todas as Marcações
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Atual do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Modo Prioridade</p>
              <Badge variant={systemState?.is_priority_mode ? "default" : "secondary"}>
                {systemState?.is_priority_mode ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Aberto para Todos</p>
              <Badge variant={systemState?.is_open_for_all ? "default" : "secondary"}>
                {systemState?.is_open_for_all ? "Sim" : "Não"}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Usuários na Fila</p>
              <Badge variant="outline">{priorityQueue.length}/12</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Marcações Ativas</p>
              <Badge variant="outline">{bookings.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <ManualAddForm priorityQueue={priorityQueue} />

      <ManualBookingForm bookings={bookings} />

      <AutoScheduleForm />

      <GamesScheduleForm />
    </div>
  );
}