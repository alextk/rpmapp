class WeeklyPlan::RpmBlocksController < WeeklyPlan::WeeklyPlanController

  def new
    @rpm_block = ::RpmBlock.new
  end

  def create
    @rpm_block = ::RpmBlock.new
    if @rpm_block.update_attributes(params[:rpm_block])
      @rpm_block.weekly_plan_assocs.create!(:weekly_plan_id => @weekly_plan.id, :position => (@weekly_plan.rpm_block_assocs.maximum(:position)||0)+1)
    end
  end

  def edit
    @rpm_block = @weekly_plan.rpm_blocks.find(params[:id])
  end

  def update
    @rpm_block = @weekly_plan.rpm_blocks.readonly(false).find(params[:id])
    @rpm_block.update_attributes(params[:rpm_block])
  end

  def destroy
    @rpm_block = @weekly_plan.rpm_blocks.readonly(false).find_by_id(params[:id])
    @rpm_block.destroy if @rpm_block.present? && (params[:approved]=='true' || @rpm_block.weekly_plans.where('weekly_plans.id != ?', @weekly_plan.id).blank?) # destroy rpm_block if approved or it does not belong to any weekly plans other than this one
  end

  def modify_completion
    @rpm_block = @weekly_plan.rpm_blocks.readonly(false).find(params[:id])
    @rpm_block.update_attributes(:completed => params[:completed])
  end

  def duplicate
    @source_rpm_block = @weekly_plan.rpm_blocks.find(params[:id])
    @weekly_plan.rpm_block_assocs.create(:rpm_block => RpmBlock.new(@source_rpm_block.attributes.slice(*%w[result purpose actions])), :position => (@weekly_plan.rpm_block_assocs.maximum(:position)||0)+1)
  end


end
