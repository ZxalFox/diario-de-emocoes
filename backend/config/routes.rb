Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'auth/register', to: 'authentication#register'
      post 'auth/login', to: 'authentication#login'
      
      resources :emotions do
        collection do
          get :weekly_summary
          get :monthly_summary
        end
      end
      
      resources :notifications, only: [:index, :create, :update]
    end
  end
end