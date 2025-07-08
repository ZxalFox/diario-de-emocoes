class Api::V1::EmotionsController < ApplicationController
  # CORREÇÃO: Adicionada a verificação de autenticação.
  # Esta linha garante que o usuário seja autenticado ANTES de qualquer
  # ação ser executada, definindo o @current_user.
  before_action :authenticate_user!
  
  before_action :set_emotion, only: [:show, :update, :destroy]
  
  def index
    # Agora, @current_user (ou current_user) estará definido e o erro não ocorrerá.
    emotions = @current_user.emotions.recent.limit(50)
    render json: emotions
  end
  
  def show
    render json: @emotion
  end
  
  def create
    emotion = @current_user.emotions.build(emotion_params)
    
    if emotion.save
      # Trigger notification for streak or achievement
      NotificationWorker.perform_async(@current_user.id, 'entry_logged', emotion.id)
      render json: emotion, status: :created
    else
      render json: { errors: emotion.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def update
    if @emotion.update(emotion_params)
      render json: @emotion
    else
      render json: { errors: @emotion.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def destroy
    @emotion.destroy
    head :no_content
  end
  
  def weekly_summary
    summary = Emotion.weekly_summary(@current_user)
    render json: summary
  end
  
  def monthly_summary
    emotions = @current_user.emotions.where('recorded_at >= ?', 1.month.ago)
    summary = {
      average_mood: emotions.average(:mood_score)&.round(1) || 0,
      total_entries: emotions.count,
      emotion_distribution: emotions.group(:emotion_type).count,
      mood_trend: emotions.group_by_week(:recorded_at).average(:mood_score)
    }
    render json: summary
  end
  
  private
  
  def set_emotion
    @emotion = @current_user.emotions.find(params[:id])
  end
  
  def emotion_params
    params.require(:emotion).permit(:emotion_type, :mood_score, :description, :recorded_at)
  end
end
