class Api::V1::AuthenticationController < ApplicationController
 
  def register
    user = User.new(user_params)
    
    if user.save
      token = user.generate_jwt
      render json: { 
        token: token, 
        user: { id: user.id, name: user.name, email: user.email } 
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = user.generate_jwt
      render json: { 
        token: token, 
        user: { id: user.id, name: user.name, email: user.email } 
      }
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end