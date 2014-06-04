class RpmBlock::WeeklyPlanAssocsController < RpmBlock::RpmBlockController

  def create
    @weekly_plan = WeeklyPlan.find(params[:target_weekly_plan_id])
    @rpm_block.weekly_plan_assocs.create!(:weekly_plan_id => @weekly_plan.id, :position => (@weekly_plan.rpm_block_assocs.maximum(:position)||0)+1)
    if params[:move] == 'true'
      @rpm_block.weekly_plan_assocs.where(:id => params[:source_assoc_id]).destroy_all if params[:source]=='weekly_plan'
      @rpm_block.daily_plan_assocs.where(:id => params[:source_assoc_id]).destroy_all if params[:source]=='daily_plan'
    end
  end

end
