class JournalEntryCategory < ActiveRecord::Base
  acts_as_searchable :name

  has_many :journal_entries
  validates_presence_of :name, :icon

  def icon_path
    "#{self.class.icons_base_path}/#{self.icon}"
  end

  def self.icons_base_path
    "/images/icons/journal_entry_category"
  end

  # return array of image file urls on disk for this area path
  # filter for .jpg or .png images only
  def self.available_icons
    Dir["#{Rails.root}/public/#{icons_base_path}/*.*"].select{|p| %w(.png  .jpg).include?(File.extname(p)) }.collect{|p| "#{self.icons_base_path}/#{File.basename(p)}" }
  end

end
