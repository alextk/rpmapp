class DailyPlan::RpmBlockAssoc::RpmBlockAssocController < DailyPlan::DailyPlanController

  before_filter :init_current_rpm_block_assoc

  def init_current_rpm_block_assoc
    @rpm_block_assoc = @daily_plan.rpm_block_assocs.find(params[:rpm_block_assoc_id])
  end

end
