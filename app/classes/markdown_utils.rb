class MarkdownUtils

  def self.renderer
    @@renderer ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(:hard_wrap => true), :autolink => true, :space_after_headers => true)
  end

end