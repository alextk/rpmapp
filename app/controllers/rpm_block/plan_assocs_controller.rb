class RpmBlock::PlanAssocsController < RpmBlock::RpmBlockController

  def new

  end

  def new_in_plan
    params[:date] ||= Time.now.to_date.strftime('%Y-%m-%d')
    day_date = Date.parse(params[:date])
    @daily_plan = DailyPlan.where(:date => day_date).first || DailyPlan.create(:date => day_date)

    day_date = WeeklyPlan.beginning_of_week_sunday(Date.parse(params[:date]))
    @weekly_plan = WeeklyPlan.where(:start_date => day_date).first || WeeklyPlan.create(:start_date => day_date)
  end

end
