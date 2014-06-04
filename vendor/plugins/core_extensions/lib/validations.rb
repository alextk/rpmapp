# validations are meant to be called from anywhere in the code to validate a value. They are also called from active record validators

module Validations

  class BaseValidation
    def valid?(value); true; end
  end

  class EmailFormat < BaseValidation
    @@pattern = /^([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})$/i

    def valid?(value)
      value =~ @@pattern ? true : false
    end
  end

  class IsraeliLandPhoneFormat < BaseValidation
    @@pattern = /^(02|03|04|08|09|077|072|073|074|076)-?[0-9]{7}$/i

    def valid?(value)
      value =~ @@pattern ? true : false
    end
  end

  class IsraeliMobilePhoneFormat < BaseValidation
    @@chars_pattern = /^[ \-\(\)0-9]+$/i
    @@country_code = '972'
    @@with_country_code_pattern = /^#{@@country_code}5[0,2,4,5,7][0-9]{#{'5123456'.length}}$/i
    @@without_country_code_pattern = /^05[0,2,4,5,7][0-9]{#{'5123456'.length}}$/i

    def valid?(value)
      return false unless value =~ @@chars_pattern
      value = clean_phone(value)
      if value.start_with?(@@country_code)
        pattern = @@with_country_code_pattern
      else
        pattern = @@without_country_code_pattern
      end
      value =~ pattern ? true : false
    end

    def clean_phone(phone)
      phone.gsub(/[^0-9]/i,'')
    end
  end
end


