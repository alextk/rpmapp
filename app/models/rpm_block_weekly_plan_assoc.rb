class RpmBlockWeeklyPlanAssoc < ActiveRecord::Base

  belongs_to :rpm_block
  belongs_to :weekly_plan

  validates_numericality_of :position, :only_integer => true, :allow_blank => false
  validates_uniqueness_of :weekly_plan_id, :scope => [:rpm_block_id]

end
