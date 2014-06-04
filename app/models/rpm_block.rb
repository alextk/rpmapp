class RpmBlock < ActiveRecord::Base
  acts_as_searchable :result

  has_many :daily_plan_assocs, :class_name => 'RpmBlockDailyPlanAssoc', :dependent => :destroy
  has_many :daily_plans, :through => :daily_plan_assocs

  has_many :weekly_plan_assocs, :class_name => 'RpmBlockWeeklyPlanAssoc', :dependent => :destroy
  has_many :weekly_plans, :through => :weekly_plan_assocs

  validates_presence_of :result, :actions, :purpose

  before_save{
    self.completed_at = self.completed? ? Time.now : nil if self.completed_was != self.completed
  }

end
