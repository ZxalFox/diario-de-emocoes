class Api::V1::NotificationsController < ApplicationController
  # CORREÇÃO: Adicionada a verificação de autenticação.
  # Esta linha garante que o usuário seja autenticado e o @current_user seja definido.
  before_action :authenticate_user! # ou :authorize_request, dependendo do nome no seu ApplicationController

  before_action :set_notification, only: [:update] # O :show e :destroy não estão nas suas rotas

  def index
    notifications = current_user.notifications.recent.limit(50)
    render json: notifications
  end

  def create
    notification = current_user.notifications.build(notification_params)
    
    if notification.save
      render json: notification, status: :created
    else
      render json: { errors: notification.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def update
    if @notification.update(notification_params)
      render json: @notification
    else
      render json: { errors: @notification.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_notification
    @notification = current_user.notifications.find(params[:id])
  end
  
  def notification_params
    params.require(:notification).permit(:title, :message, :notification_type, :read)
  end
end
