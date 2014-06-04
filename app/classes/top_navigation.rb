class TopNavigation
  attr_reader :nav_pills

  def initialize(tpl, active_pill)
    @nav_pills = [
        Pill.new(:home, tpl.home_path, :text => 'דף הבית'),
        Pill.new(:planning, 'javascript:;', :text => 'תכנונים') do |dropdown_pills|
          dropdown_pills << Pill.new(:daily_plans, tpl.day_view_daily_plans_path, :text => 'יומיים')
          dropdown_pills << Pill.new(:weekly_plans, tpl.week_view_weekly_plans_path, :text => 'שבועיים')
          dropdown_pills << Pill.new(:rpm_blocks, tpl.rpm_blocks_path, :text => 'בלוקי RPM')
        end,
        Pill.new(:snippets, 'javascript:;', :text => 'סניפטים') do |dropdown_pills|
          dropdown_pills << Pill.new(:snippets_lists, tpl.snippets_lists_path, :text => 'רשימות סניפטים', :icon => 'icon-list')
          dropdown_pills << Pill.new(:snippets, tpl.snippets_path, :text => 'מאגר סניפטים', :icon => 'icon-th')
        end,
        Pill.new(:journal, 'javascript:;', :text => 'יומן') do |dropdown_pills|
          dropdown_pills << Pill.new(:day_view, tpl.day_view_journal_entries_path, :text => 'מבט יומי', :icon => 'icon-calendar')
          dropdown_pills << Pill.new(:month_view, tpl.month_view_journal_entries_path, :text => 'מבט חודשי', :icon => 'icon-calendar')
          dropdown_pills << Pill.new(:list_view, tpl.journal_entries_path, :text => 'תצוגת רשימה', :icon => 'icon-list')
          dropdown_pills << Pill.new(:categories, tpl.journal_entry_categories_path, :text => 'ניהול סיווגים', :icon => 'icon-folder-open')
        end
    ]

    #@nav_pills << Pill.new(:daily_plans, 'javascript:;') do |dropdown_pills|
    #  dropdown_pills << Pill.new(:pill1, '', :icon=>'icon-file')
    #end

    @active_pill = active_pill
  end

  def active_pill?(pill)
    @active_pill == pill.key
  end

  class Pill
    attr_reader :key, :path, :dropdown_pills

    def initialize(key, path, options = {}, &dropdown_pills_block)
      @key = key.to_s
      @path = path
      @options = options
      if dropdown_pills_block.present?
        @dropdown_pills = []
        yield @dropdown_pills
      end
    end

    def text
      @options[:text]
    end

    def active?
      @options[:active]
    end

    def fbox_link?
      @options[:fbox_link]
    end

    def css_class
      "#{@key} #{@options[:class]}"
    end

    def dropdown_menu?
      self.dropdown_pills.present? && self.dropdown_pills.any?
    end

    def icon
      @options[:icon]
    end

    def target
      @options[:target]
    end
  end

end