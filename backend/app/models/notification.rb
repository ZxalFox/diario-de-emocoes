class Notification < ApplicationRecord
  belongs_to :user
  
  validates :title, presence: true
  validates :message, presence: true
  validates :notification_type, presence: true
  
  NOTIFICATION_TYPES = %w[reminder achievement weekly_summary daily_checkin].freeze
  
  validates :notification_type, inclusion: { in: NOTIFICATION_TYPES }
  
  scope :unread, -> { where(read: false) }
  scope :recent, -> { order(created_at: :desc) }
end