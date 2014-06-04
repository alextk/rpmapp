class DailyPlan::RpmBlockAssocsController < DailyPlan::DailyPlanController

  def update_positions
    params[:ids].each_with_index do |id, index|
      @daily_plan.rpm_block_assocs.where(:id => id).update_all(:position => index)
    end
    render :status => 200, :text => 'ok'
  end

  def destroy
    @assoc = @daily_plan.rpm_block_assocs.find_by_id(params[:id])
    @assoc.destroy if @assoc.present?
  end

end
