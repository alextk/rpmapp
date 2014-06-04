# Load rependecies
require 'radio_bar'

#['data_grid', 'config', 'model', 'builder', 'helpers', 'table_renderer'].each do |file_name|
#  require_dependency File.join(File.dirname(__FILE__), 'lib', file_name)
#end

# load i18n translations
I18n.load_path += Dir[ File.join(File.dirname(__FILE__), 'locales', '*.{rb,yml}') ]