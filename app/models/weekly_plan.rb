class WeeklyPlan < ActiveRecord::Base

  has_many :rpm_block_assocs, :class_name => 'RpmBlockWeeklyPlanAssoc', :dependent => :destroy
  has_many :rpm_blocks, :class_name => '::RpmBlock', :through => :rpm_block_assocs

  validates_presence_of :start_date
  validate :validate_start_date_is_beginning_of_week

  def validate_start_date_is_beginning_of_week
    self.errors.add(:start_date, 'תאריך תחילת שבוע חייב להיות יום ראשון') if self.start_date.present? && self.start_date.wday != 0
  end

  def end_date
    self.start_date + 6.days
  end

  def self.beginning_of_week_sunday(date)
    date.wday == 0 ? date : date - date.wday.days
  end

end
