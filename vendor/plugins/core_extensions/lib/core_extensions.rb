# Change FieldWithError behavior
ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
  if html_tag =~ /<(input|textarea|select)/ && !(html_tag =~ /type=['"]hidden["']/)
    error_class = "error"
    error_message = instance.error_message.kind_of?(Array) ? instance.error_message.last : instance.error_message
    if html_tag =~ /<[^>]+class=/ # html tag has class attribute, append to its value
      class_attribute_index = html_tag =~ /class=['"]/
      html_tag.insert(class_attribute_index+7, "#{error_class} ")
    else
      end_of_tag_index = html_tag =~ /\/>/ || html_tag =~ />/ # tag can end with "../>" or with "..>"
      html_tag.insert(end_of_tag_index, %(  class="#{error_class}"))
    end
    # if we'll want to generate qtip error messages will pull error message from data-error_message attribute
    #end_of_tag_index = html_tag =~ /\/>/ || html_tag =~ />/  # tag can end with "../>" or with "..>"
    #html_tag.insert(end_of_tag_index, %( data-error="true" data-error_message="#{error_message}"))
    unless html_tag =~ /data-error_wrap=['"]false["']/
      arrow = I18n.t('language.direction') == 'rtl' ? "&larr;" : "&rarr;"
      html_tag = %(#{html_tag} <div class="error-explanation">#{arrow} #{error_message}</div>).html_safe
    end
  end
  html_tag
end

module ActionView::Helpers

  module TagHelper

    def filtered_dropdown_tag(name ,items, options = {}, &block)
      block ||= lambda {|o|  o.to_s  }
      raise ArgumentError, 'dropdown must start with a selected value' unless options.has_key? :selected
      sticky_items = options[:sticky_items] || []
      selected = (sticky_items + items).detect {|item| item[1] == options[:selected] }
      selected = selected[0] if selected

      #define as lambda as to not pollute namespace.
      render_item = lambda { |item, klass|
        item, value = item
        concat(
            content_tag(:li, '', :class=> klass) do
              link_to 'javascript:;', 'data-value'=>value do
                block.call(item)
              end
            end
        )
      }


      #create markup
      concat( hidden_field_tag(name, options[:selected]) )
      content_tag(:div, '', :style=>'position:relative;display: inline-block') do
        link_to('#', :class=>'btn dropdown-toggle', 'data-toggle'=>'dropdown', :style => 'text-decoration: none;') do
          content_tag(:span, :class=>'dropdown-label') do
            block.call(selected) unless selected.nil?
          end +
              content_tag(:span, '', :class=>'caret')
        end +
          content_tag(:ul, :class=>'dropdown-menu scrolled', 'data-update'=>"[name=\"#{name}\"]") do
            concat(
              content_tag(:li) do
                text_field_tag('filter', '', :auto_complete => 'off', 'data-provides'=>"filter", :placeholder => 'חפש...')
              end
            )
            concat( content_tag(:li, '', :class=>'divider') )
            sticky_items.each do |item|
              render_item.call(item, '')
            end
            concat( content_tag(:li, '', :class=>'divider') ) unless sticky_items.empty?
            items.each do |item|
              render_item.call(item, 'filterable')
            end
          end
      end
    end

  end

  module FormOptionsHelper

    def multiple_select(object, method, choices, options = {}, html_options = {})
      options = {:selected => []}.merge(options)
      html_options = {:class => 'select_multiple', :value => options[:selected].join(',')}.merge(html_options)
      id = "#{object.id}_#{object.gsub(/\]\[|[^-a-zA-Z0-9:.]/, "_").sub(/_$/, "")}_#{method.to_s.sub(/\?$/, "")}"
      capture_haml do
        haml_tag :span, :style => 'display:none' do
          haml_concat check_box_tag "#{object}[#{method}][]", '', true,
                                    options.merge(:id => id)
        end

        haml_tag :div, :id => "select_#{id}_container", :class => 'select_multiple', :style => 'position:relative' do
          haml_concat select_tag "select_multiple_#{id}", options_for_select(choices), html_options
          haml_concat link_to 'Select multiple', nil, :id => "select_multiple_#{id}_open"
          haml_tag :div, :id => "select_#{id}_options", :class => 'select_multiple_container', :style => 'display:none' do
            haml_tag :div, 'Select Multiple', :class => 'select_multiple_header'
            haml_tag :table, :cellspacing => "0", :cellpadding => "0", :class => "select_multiple_table", :width => "100%" do
              for choice in choices
                selected = options[:selected].include?(choice[1])
                haml_tag :tr, :class => cycle('odd', 'even') do
                  haml_tag :td, :class => 'select_multiple_name' do
                    haml_concat label_tag "#{object}[#{method}][]#{choice[1]}", choice[0]
                  end
                  haml_tag :td, :class => 'select_multiple_checkbox' do
                    haml_concat check_box_tag "#{object}[#{method}][]", choice[1], selected,
                                              options.merge(:id => "#{object.gsub(/\]\[|[^-a-zA-Z0-9:.]/, "_").sub(/_$/, "")}_#{method.to_s.sub(/\?$/, "")}_#{choice[1]}")
                  end
                end unless choice[1].blank?
              end
            end
            haml_tag :div, :class => 'select_multiple_submit' do
              haml_concat submit_tag 'Done', :id => "select_multiple_#{id}_close"
            end
          end
        end
        haml_concat javascript_tag "new Horizon.UI.SelectMultiple('#{id}')"
      end
    end

    def field_errors(object, method, errors, options = {}, html_options = {})
      InstanceTag.new(object, method, self, options.delete(:object)).to_field_errors_tag(errors, options, html_options)
    end

    def filtered_dropdown(object_name, method, items, options = {}, &block)
      InstanceTag.new(object_name, method, self, options.delete(:object)).to_filtered_dropdown(items, options, &block)
    end

  end

  class InstanceTag
    def to_field_errors_tag(errors, options, html_options)
      error_message = errors.kind_of?(Array) ? errors.last : errors
      return '' unless error_message.present?
      html_options = html_options.stringify_keys
      add_default_name_and_id(html_options)
      html_options['data-for'] = html_options.delete('id')
      html_options.delete('name')
      html_options['class'] = "error-explanation " + (html_options['class'] || '')
      html_options['class'] += ' inline' if options[:inline]
      if options[:arrow]
        arrow = I18n.t('language.direction') == 'rtl' ? "&larr;" : "&rarr;"
        error_message = "#{arrow} #{error_message}".html_safe
      end
      content_tag("div", error_message, html_options)
    end

    def to_filtered_dropdown(items, options = {}, &block)
      add_default_name_and_id(options)
      options[:selected] = value(object) unless options.has_key? :selected
      error_wrapping( @template_object.filtered_dropdown_tag(options['name'], items, options, &block) )
    end

  end

  class FormBuilder

    def filtered_dropdown(method, items, options = {}, &block)
      @template.filtered_dropdown(@object_name, method, items, objectify_options(options), &block)
    end

    def multiple_select(method, choices, options = {}, html_options = {})
      options = {:selected => @object.send(method)}.merge(options)
      @template.multiple_select(@object_name, method, choices, objectify_options(options), @default_options.merge(html_options))
    end

    alias_method :label_original, :label
    # allow label tag to have nested content (like: f.label :asdf do ... end)
    def label(method, content_or_options_with_block = nil, options = {}, &block)
      if !block_given?
        label_original(method, content_or_options_with_block, options)
      else
        options = content_or_options_with_block.is_a?(Hash) ? content_or_options_with_block.stringify_keys : {}
        @template.content_tag(:label, options, &block)
      end
    end

    def field_errors(method, options = {}, html_options = {})
      options = {:inline => false, :arrow => true}.update(options)
      @template.field_errors(@object_name, method, @object.errors[method], objectify_options(options), html_options)
    end

  end
end

module ActiveRecord
  class Base
    class << self

      # this is needed because reset_column_information_and_inheritable_attributes_for_all_subclasses makes subclass attributes inaccessible
      def reset_column_information_for_all_subclasses
        self.reset_column_information
        self.descendants.each { |clazz| clazz.reset_column_information }
      end

    end

    def touch
      if record_timestamps
        t = self.class.default_timezone == :utc ? Time.now.utc : Time.now
        write_attribute('updated_at', t) if respond_to?(:updated_at)
        write_attribute('updated_on', t) if respond_to?(:updated_on)
      end
      self
    end

    #can replace with Relation#references in Rails 4
    def self.left_join(kls)
      this = self.arel_table
      association = self.reflect_on_association(kls)
      other = association.klass.arel_table
      left_key, right_key = association.belongs_to? ?  [association.association_foreign_key, other.primary_key.name]  : [this.primary_key.name, association.primary_key_name]
      joins(this.join(other, Arel::Nodes::OuterJoin).on(this[left_key].eq(other[right_key])).join_sql)
    end

  end
end

module ActiveModel
  # == Active Model Absence Validator
  module Validations
    class AbsenceValidator < EachValidator #:nodoc:
      def validate(record)
        record.errors.add_on_not_blank(attributes, options)
      end
    end
    module HelperMethods
      # Validates that the specified attributes are blank (as defined by
      # Object#blank?). Happens by default on save.
      #
      #   class Person < ActiveRecord::Base
      #     validates_absence_of :first_name
      #   end
      #
      # The first_name attribute must be in the object and it must be blank.
      #
      # Configuration options:
      # * <tt>:message</tt> - A custom error message (default is: "must be blank").
      #
      # There is also a list of default options supported by every validator:
      # +:if+, +:unless+, +:on+ and +:strict+.
      # See <tt>ActiveModel::Validation#validates</tt> for more information
      def validates_absence_of(*attr_names)
        validates_with AbsenceValidator, _merge_attributes(attr_names)
      end
    end
  end

  class Errors < ActiveSupport::OrderedHash

    # Will add an error message to each of the attributes in +attributes+ that
    # is not blank (using Object#blank?).
    #
    #   person.errors.add_on_not_blank(:name)
    #   person.errors.messages
    #   # => { :name => ["must be blank"] }
    def add_on_not_blank(attributes, options = {})
      [attributes].flatten.each do |attribute|
        value = @base.send(:read_attribute_for_validation, attribute)
        add(attribute, :not_blank, options) unless value.blank?
      end
    end

  end

end

#Backport
class Object
  def in?(*args)
    if args.length > 1
      args.include? self
    else
      another_object = args.first
      if another_object.respond_to? :include?
        another_object.include? self
      else
        raise ArgumentError.new 'The single parameter passed to #in? must respond to #include?'
      end
    end
  end
end