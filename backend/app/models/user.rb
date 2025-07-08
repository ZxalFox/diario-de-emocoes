class User < ApplicationRecord
  has_secure_password
  
  has_many :emotions, dependent: :destroy
  has_many :notifications, dependent: :destroy
  
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  
  def generate_jwt
    JWT.encode({ user_id: id, exp: 24.hours.from_now.to_i }, Rails.application.secret_key_base)
  end
end