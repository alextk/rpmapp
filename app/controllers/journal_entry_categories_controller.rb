class JournalEntryCategoriesController < ApplicationController

  def index
    init_data_grid
  end

  def grid_api
    init_data_grid
  end

  def new
    @category = JournalEntryCategory.new
  end

  def create
    @category = JournalEntryCategory.new
    @category.update_attributes(params[:journal_entry_category])
  end

  def edit
    @category = JournalEntryCategory.find(params[:id])
  end

  def update
    @category = JournalEntryCategory.find(params[:id])
    @category.update_attributes(params[:journal_entry_category])
  end

  def destroy
    @category = JournalEntryCategory.find_by_id(params[:id])
    @category.destroy if @category.present?
  end

  private
  def init_data_grid
    @dgc = AjaxDataGrid::Config.new({ :params => params, :sort_by => 'name', :sort_direction => 'asc', :any_rows => JournalEntryCategory.any?, :paging_page_size => 25,
                                      :filter_free_text => ''
                                    })

    categories = JournalEntryCategory.scoped
    categories = categories.search(@dgc.options.filter_free_text) if @dgc.options.filter_free_text.present?  #filter by free text

    @dgc.init_model(categories)
  end
end
