class SnippetsList::SnippetsController < SnippetsList::SnippetsListController

  def new
    @snippet = @snippets_list.snippets.build
  end

  def create
    @snippet = @snippets_list.snippets.build(:snippets_list_position => (@snippets_list.snippets.maximum(:snippets_list_position)||0)+1)
    @snippet.update_attributes(params[:snippet])
  end

  def edit
    @snippet = @snippets_list.snippets.find(params[:id])
  end

  def update
    @snippet = @snippets_list.snippets.find(params[:id])
    @snippet.update_attributes(params[:snippet])
  end

  def duplicate
    original_snippet = @snippets_list.snippets.find(params[:id])
    @snippet = @snippets_list.snippets.build(original_snippet.attributes.slice(*%w(name  description  purpose)))
  end

  def destroy
    @snippet = @snippets_list.snippets.find_by_id(params[:id])
    @snippet.destroy if @snippet.present?
  end

  def update_positions
    params[:ids].each_with_index do |id, index|
      @snippets_list.snippets.where(:id => id).update_all(:snippets_list_position => index)
    end
    render :status => 200, :text => 'ok'
  end

end
