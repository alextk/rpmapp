class Snippet < ActiveRecord::Base

  belongs_to :snippets_list

  validates_presence_of :name
  validates_numericality_of :snippets_list_position, :only_integer => true, :allow_blank => false

end
