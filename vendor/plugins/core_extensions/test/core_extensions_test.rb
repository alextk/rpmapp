require 'test_helper'

class CoreExtensionsTest < ActiveSupport::TestCase

  test "Magick collect and find" do
    result = [{:name=>'Guy',:last_name=>'Shmuely'},
              {:name=>'Jack',:last_name=>'Sperow'}].select_by_name_and_last_name('Guy','Shmuely')
    assert result == [{:name=>'Guy',:last_name=>'Shmuely'}]
    result = [{:name=>'Guy',:last_name=>'Shmuely',:age=>25},
              {:name=>'Jack',:last_name=>'Sperow'},
              {:name=>'Roobin'}].collect_name_and_last_name
    assert result == [['Guy','Shmuely'],['Jack','Sperow'],['Roobin',nil]]
  end

  test "Random element" do
    is_random = false
    elements = [1,2,3,4,5,6,7,8,9,10]
    100.times do
      is_random = true and break if (e=elements.random_element) != 5 and elements.include?(e)
    end
    assert is_random
  end

  test "NilClass, Numeric, String extensions" do
    assert nil.empty?
    assert !nil.any?
    assert nil.blank?
    assert !nil.include?(nil)
    assert nil.zero?
    assert nil.to_sym==''
    assert nil.strip.nil?
    assert nil.truncate.nil?
    assert !5.empty?
    assert 'זאת היא בדיקה, שים לב שהטקסט אמור להיגמר כאן!...' == 'זאת היא בדיקה, שים לב שהטקסט אמור להיגמר כאן! הטקס הזה לא אמור להופיע'.truncate(45)
    assert "...This text should appear" == "This text shouldn't appear, This text should appear".truncate_first(23)
    url = 'http://wiki.rego.co.il/doku.php?id=development:horizon3:plugins:core_extensions:start&do=edit&rev='
    assert url.to_params == {:do=>"edit", :rev=>nil, :id=>"development:horizon3:plugins:core_extensions:start"}    
    assert '10/10/10'.parse_date == Date.new(10,10,10)
  end


end
