class LocaleUtils
  include Singleton

  NAME_SPECIAL_CHARS = " &0123456789()'\"-+_,.׳"

  def name_in_locale?(str, options = {})
    options = {:special_chars => NAME_SPECIAL_CHARS}.update(options)
    string_in_locale?(str, options)
  end

  # this method check if each character in this string is in given locale
  # options
  #  - locale: pass locale to check given string. Default to I18n.locale. The locale chars are retrieved from language.characters
  #  - special_chars: pass string of special chars to allow. defaults to ' ' (space)
  def string_in_locale?(str, options = {})
    options = {:locale => I18n.locale, :special_chars => ' '}.update(options)
    chars = "#{options[:special_chars]}#{locale_only_chars(options[:locale])}"
    r = Regexp.new("^[#{Regexp.escape(chars)}]+$", Regexp::IGNORECASE)
    r.match(str).present?
  end

  def locale_only_chars(locale)
    I18n.t('language.characters', :locale => locale.to_sym)
  end

end