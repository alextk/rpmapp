class DailyPlan < ActiveRecord::Base

  has_many :rpm_block_assocs, :class_name => 'RpmBlockDailyPlanAssoc', :dependent => :destroy
  has_many :rpm_blocks, :class_name => '::RpmBlock', :through => :rpm_block_assocs

  has_many :rpm_block_time_commitments, :dependent => :destroy

  validates_presence_of :date

end
