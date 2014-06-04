# this class wraps Logging::Layouts::Pattern class and tags all log statements with Thread.current[:_pattern_layout_output_tag] (which is set in the middleware)
class LoggingPatternLayoutTagger < ::Logging::Layout

  def initialize(pattern_layout)
    @layout = pattern_layout
  end

  def format( event )
    str = @layout.format(event)
    str = Thread.current[:_pattern_layout_output_tag] + str if Thread.current[:_pattern_layout_output_tag].present? # note that we prepend the str because it ends with \n
    str
  end

  def header
    @layout.header
  end
  def footer
    @layout.footer
  end
  def format_obj(obj)
    @layout.format_obj(obj)
  end
  def try_yaml(obj)
    @layout.try_yaml(obj)
  end

end