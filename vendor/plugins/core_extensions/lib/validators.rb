#TODO: Add doc.
class EmailFormatValidator < ActiveModel::EachValidator
  EmailAddress = begin
  #  qtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]'
  #  dtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]'
  #  atom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-' +
  #    '\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+'
  #  quoted_pair = '\\x5c[\\x00-\\x7f]'
  #  domain_literal = "\\x5b(?:#{dtext}|#{quoted_pair})*\\x5d"
  #  quoted_string = "\\x22(?:#{qtext}|#{quoted_pair})*\\x22"
  #  domain_ref = atom
  #  sub_domain = "(?:#{domain_ref}|#{domain_literal})"
  #  word = "(?:#{atom}|#{quoted_string})"
  #  domain = "#{sub_domain}(?:\\x2e#{sub_domain})*"
  #  local_part = "#{word}(?:\\x2e#{word})*"
  #  addr_spec = "#{local_part}\\x40#{domain}"
  #  pattern = /\A#{addr_spec}\z/
    pattern = /^([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})$/i
  end

  def validate_each(record, attribute, value)
    unless value =~ EmailAddress
      record.errors[attribute] << (options[:message] || I18n.t("activerecord.errors.models.#{record.class.name.underscore}.attributes.#{attribute}.format",
                                                               :default => I18n.t('errors.attributes.email.format')))
    end
    #begin
    #  m = Mail::Address.new(value)
    #  # We must check that value contains a domain and that value is an email address
    #  r = m.domain && m.address == value
    #  t = m.__send__(:tree)
    #  # We need to dig into treetop
    #  # A valid domain must have dot_atom_text elements size > 1
    #  # user@localhost is excluded
    #  # treetop must respond to domain
    #  # We exclude valid email values like <user@localhost.com>
    #  # Hence we use m.__send__(tree).domain
    #  r &&= (t.domain.dot_atom_text.elements.size > 1)
    #rescue Exception => e
    #  r = false
    #end
    #unless r
    #  record.errors[attribute] << (options[:message] || I18n.t("activerecord.errors.models.#{record.class.name.underscore}.attributes.#{attribute}.format",
    #                                                           :default => I18n.t('errors.attributes.email.format')))
    #end
  end
end

class PhoneNumberFormatValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?
    value = PhoneNumberUtils.normalize(value)
    error = false
    if value.starts_with?('972') # allow 972541234657 OR 97231234567
      cellular_only = options[:cellular_only] || false
      if cellular_only
        error = true unless value.size == 12
      else
        error = true if !(value.size >= 11 && value.size <= 12)
      end
    else
      error = true if !(value.size >= 9 && value.size <= 16)
    end
    if error
      default_message = options[:cellular_only] ? I18n.t('errors.attributes.cellular_phone.format') : I18n.t('errors.attributes.phone.format')
      record.errors[attribute] << (options[:message] || I18n.t("activerecord.errors.models.#{record.class.name.underscore}.attributes.#{attribute}.format",
                                                               :default => default_message))
    end
  end
end

class CellularPhoneFormatValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    country_code = options[:country_code] || ''
    length = country_code.blank? ? '0545123456'.length : '545123456'.length
    unless value =~ /^#{country_code}[0-9]{#{length}}$/
      record.errors[attribute] << (options[:message] || I18n.t("activerecord.errors.models.#{record.class.name.underscore}.attributes.#{attribute}.format",
                                                               :default => I18n.t('errors.attributes.cellular_phone.format')))
    end
  end
end

class PhoneFormatValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~  %r{\A[0-9\-+]{5,}\Z}i
      record.errors[attribute] << (options[:message] || I18n.t("activerecord.errors.models.#{record.class.name.underscore}.attributes.#{attribute}.format",
                                                               :default => I18n.t('errors.attributes.phone.format')))
    end
  end
end

class DateFormatValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    raw_value = record.send("#{attribute}_before_type_cast")
    if !raw_value.empty? && !raw_value.is_a?(Date)
      begin
        result = DateTime.strptime(raw_value, options[:format] || I18n.t('date.formats.default'))
      rescue
        record.errors[attribute] << (options[:message] || I18n.t("activerecord.errors.models.#{record.class.name.underscore}.attributes.#{attribute}.format",
                                                                  :default => I18n.t('errors.messages.date_format')))
      end
    end
  end
end
