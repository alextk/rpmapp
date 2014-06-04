class RpmBlockDailyPlanAssoc < ActiveRecord::Base

  belongs_to :rpm_block
  belongs_to :daily_plan

  has_many :time_commitments, :class_name => 'RpmBlockTimeCommitment', :dependent => :destroy

  validates_numericality_of :position, :only_integer => true, :allow_blank => false
  validates_uniqueness_of :daily_plan_id, :scope => [:rpm_block_id]

end
