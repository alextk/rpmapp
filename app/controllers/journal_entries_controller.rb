class JournalEntriesController < ApplicationController

  def index
    init_data_grid
  end

  def grid_api
    init_data_grid
  end

  def month_view
    params[:month] ||= Time.now.to_date.strftime('%Y-%m')
    @beginning_of_month = Date.parse("#{params[:month]}-01")
  end

  def day_view
    params[:date] ||= Time.now.to_date.strftime('%Y-%m-%d')
    @day_date = @je.try(:date) || Date.parse(params[:date])
  end

  def new
    params[:date] ||= Time.now.to_date.strftime('%Y-%m-%d')
    @je = JournalEntry.new(:date => Date.parse(params[:date]))
  end

  def create
    @je = JournalEntry.new
    if @je.update_attributes(params[:journal_entry])
      day_view
    end
  end

  def edit
    @je = JournalEntry.find(params[:id])
  end

  def update
    @je = JournalEntry.find(params[:id])
    if @je.update_attributes(params[:journal_entry])
      day_view
    end
  end

  def show
    @je = JournalEntry.find(params[:id])
  end

  def destroy
    @je = JournalEntry.find_by_id(params[:id])
    @je.destroy if @je.present?
    (params[:date]=Time.now.strftime('%Y-%m-%d')) && day_view
  end

  private
  def init_data_grid
    @dgc = AjaxDataGrid::Config.new({ :params => params, :sort_by => 'name', :sort_direction => 'asc', :any_rows => JournalEntry.any?, :paging_page_size => 25,
                                      :filter_free_text => '', :filter_journal_entry_category_id => 'all', :filter_created_at_from => '', :filter_created_at_to => ''
                                    })

    entries = JournalEntry.scoped
    entries = entries.search(@dgc.options.filter_free_text) if @dgc.options.filter_free_text.present?  #filter by free text
    entries = entries.where(:journal_entry_category_id => @dgc.options.filter_journal_entry_category_id) if @dgc.options.filter_journal_entry_category_id != 'all'

    if @dgc.options.filter_created_at_from.present? && @dgc.options.filter_created_at_to.present?
      entries = entries.where('journal_entries.created_at between ? and ?', Date.parse(@dgc.options.filter_created_at_from, '%d/%m/%Y').to_time, Date.parse(@dgc.options.filter_created_at_to, '%d/%m/%Y').to_time.end_of_day)
    elsif @dgc.options.filter_created_at_from.present?
      entries = entries.where('journal_entries.created_at >= ?', Date.parse(@dgc.options.filter_created_at_from, '%d/%m/%Y').to_time)
    elsif @dgc.options.filter_created_at_to.present?
      entries = entries.where('journal_entries.created_at <= ?', Date.parse(@dgc.options.filter_created_at_to, '%d/%m/%Y').to_time.end_of_day)
    end

    @dgc.init_model(entries)
  end
end
