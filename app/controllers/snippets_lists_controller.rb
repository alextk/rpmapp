class SnippetsListsController < ApplicationController

  def index
    init_data_grid
  end

  def grid_api
    init_data_grid
  end

  def new
    @snippets_list = SnippetsList.new
  end

  def create
    @snippets_list = SnippetsList.new
    @snippets_list.update_attributes(params[:snippets_list])
  end

  def edit
    @snippets_list = SnippetsList.find(params[:id])
  end

  def update
    @snippets_list = SnippetsList.find(params[:id])
    @snippets_list.update_attributes(params[:snippets_list])
  end

  def destroy
    @snippets_list = SnippetsList.find_by_id(params[:id])
    @snippets_list.destroy if @snippets_list.present?
  end

  def show
    @snippets_list = SnippetsList.find(params[:id])
  end

  private
  def init_data_grid
    @dgc = AjaxDataGrid::Config.new({ :params => params, :sort_by => 'name', :sort_direction => 'asc', :any_rows => SnippetsList.any?, :paging_page_size => 25,
                                      :filter_free_text => ''
                                    })

    entries = SnippetsList.scoped
    entries = entries.search(@dgc.options.filter_free_text) if @dgc.options.filter_free_text.present?  #filter by free text

    @dgc.init_model(entries)
  end

end
