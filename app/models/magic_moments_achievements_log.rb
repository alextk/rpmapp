class MagicMomentsAchievementsLog < ActiveRecord::Base
  date_attr_writer :date

  validates_presence_of :date, :magic_moments, :achievements

  def magic_moments_html
    MarkdownUtils.renderer.render(self.magic_moments)
  end

  def achievements_html
    MarkdownUtils.renderer.render(self.achievements)
  end

  def general_thoughts_html
    MarkdownUtils.renderer.render(self.general_thoughts)
  end
end
