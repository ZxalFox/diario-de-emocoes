class Emotion < ApplicationRecord
  belongs_to :user
  
  validates :mood_score, presence: true, inclusion: { in: 1..10 }
  validates :emotion_type, presence: true
  validates :recorded_at, presence: true
  
  EMOTION_TYPES = %w[happy sad anxious excited calm angry frustrated grateful content stressed].freeze
  
  validates :emotion_type, inclusion: { in: EMOTION_TYPES }
  
  scope :recent, -> { order(recorded_at: :desc) }
  scope :by_date_range, ->(start_date, end_date) { where(recorded_at: start_date..end_date) }
  
  def self.weekly_summary(user)
    emotions = user.emotions.where('recorded_at >= ?', 1.week.ago)
    {
      average_mood: emotions.average(:mood_score)&.round(1) || 0,
      total_entries: emotions.count,
      most_common_emotion: emotions.group(:emotion_type).count.max_by { |_, count| count }&.first,
      daily_breakdown: emotions.group_by_day(:recorded_at).average(:mood_score)
    }
  end
end