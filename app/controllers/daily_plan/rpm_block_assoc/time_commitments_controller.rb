class DailyPlan::RpmBlockAssoc::TimeCommitmentsController < DailyPlan::RpmBlockAssoc::RpmBlockAssocController

  def new
    @time_commitment = @rpm_block_assoc.time_commitments.build(:start_at => @daily_plan.date.beginning_of_day + 10.hours)
    @time_commitment.start_at_time = params[:start_at_time] if params[:start_at_time].present?
    @time_commitment.end_at = @time_commitment.start_at + 1.hour
  end

  def create
    @time_commitment = @rpm_block_assoc.time_commitments.build
    @time_commitment.update_attributes(params[:rpm_block_time_commitment])
  end

  def edit
    @time_commitment = @rpm_block_assoc.time_commitments.find(params[:id])
  end

  def update
    @time_commitment = @rpm_block_assoc.time_commitments.find(params[:id])
    @time_commitment.update_attributes(params[:rpm_block_time_commitment])
  end

  def destroy
    @time_commitment = @rpm_block_assoc.time_commitments.find(params[:id])
    @time_commitment.destroy
  end

end
