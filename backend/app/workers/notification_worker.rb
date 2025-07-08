class NotificationWorker
  include Sidekiq::Worker
  
  def perform(user_id, notification_type, emotion_id = nil)
    user = User.find_by(id: user_id)
    return unless user

    case notification_type
    when 'entry_logged'
      create_entry_logged_notification(user, emotion_id)
    when 'daily_reminder'
      create_daily_reminder(user)
    when 'weekly_summary'
      create_weekly_summary(user)
    end
  end
  
  private
  
  def create_entry_logged_notification(user, emotion_id)
    emotion = Emotion.find_by(id: emotion_id)
    return unless emotion

    streak = calculate_streak(user)
    
    if streak >= 7 &&  # Notifica a cada 7 dias de sequência
      user.notifications.create!(
        title: "🎉 Ótima sequência!",
        message: "Você anotou emoções por #{streak} dias seguidos! Continue assim!",
        notification_type: 'achievement'
      )
    end

    user.notifications.create!(
      title: "📝 Registro de Emoção",
      message: "Você registrou uma nova emoção: #{emotion.mood} às #{emotion.recorded_at.strftime('%H:%M')}.",
      notification_type: 'entry_logged'
    )
  end
  
  def create_daily_reminder(user)
    return if user.emotions.where('recorded_at >= ?', Date.current.beginning_of_day).exists?
    
    user.notifications.create!(
      title: "💭 Registro diário",
      message: "Como está se sentindo hoje? Tire um momento para refletir sobre suas emoções.",
      notification_type: 'daily_checkin'
    )
  end
  
  def create_weekly_summary(user)
    summary = Emotion.weekly_summary(user)
    
    user.notifications.create!(
      title: "📊 Seu resumo emocional semanal",
      message: "Humor médio: #{summary[:average_mood]}/10. Você fez #{summary[:total_entries]} anotações essa semana!",
      notification_type: 'weekly_summary'
    )
  end
  
  # LÓGICA CORRIGIDA: Calcula a sequência de dias consecutivos de forma mais robusta.
  def calculate_streak(user)
    # Pega as datas únicas dos registros, em ordem decrescente.
    dates = user.emotions.order(recorded_at: :desc).pluck(:recorded_at).map(&:to_date).uniq

    return 0 if dates.empty?

    # A sequência começa em 1 (o dia do último registro).
    streak = 1
    # A data que esperamos encontrar na próxima iteração.
    expected_date = dates.first.prev_day

    # Itera sobre as outras datas (a partir da segunda).
    dates.slice(1..-1).each do |date|
      if date == expected_date
        streak += 1
        expected_date = expected_date.prev_day
      else
        # Se houver uma quebra na sequência, para a contagem.
        break
      end
    end
    
    streak
  end
end
