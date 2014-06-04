class RpmBlock::DailyPlanAssocsController < RpmBlock::RpmBlockController

  def create
    @daily_plan = DailyPlan.find(params[:target_daily_plan_id])
    @rpm_block.daily_plan_assocs.create!(:daily_plan_id => @daily_plan.id, :position => (@daily_plan.rpm_block_assocs.maximum(:position)||0)+1)
    if params[:move] == 'true'
      @rpm_block.weekly_plan_assocs.where(:id => params[:source_assoc_id]).destroy_all if params[:source]=='weekly_plan'
      @rpm_block.daily_plan_assocs.where(:id => params[:source_assoc_id]).destroy_all if params[:source]=='daily_plan'
    end
  end

end
