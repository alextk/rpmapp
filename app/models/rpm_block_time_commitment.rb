class RpmBlockTimeCommitment < ActiveRecord::Base
  timestamp_attr_writer :start_at, :end_at, :date_format => '%Y-%m-%d', :time_format => '%H:%M'

  belongs_to :daily_plan
  belongs_to :rpm_block_daily_plan_assoc

  validates_presence_of :start_at_date, :end_at_date, :start_at_time, :end_at_time
  validate :validate_start_is_before_end

  before_create {
    self.daily_plan_id = self.rpm_block_daily_plan_assoc.daily_plan_id
  }

  def validate_start_is_before_end
    self.errors.add(:end_at_time, 'חייב להיות לפחות 15 דקות אחרי זמן התחלה') if self.start_at.present? && self.end_at.present? && self.end_at-self.start_at < 15.minutes
  end

  def duration_in_minutes
    (self.end_at - self.start_at).round / 60
  end

  def start_at_from_midnight_in_minutes
    (self.start_at - self.rpm_block_daily_plan_assoc.daily_plan.date.beginning_of_day).round / 60
  end

end
