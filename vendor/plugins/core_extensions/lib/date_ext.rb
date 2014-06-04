class Date

  def self.parse(date_string, format = nil)
    format ||= '%Y-%m-%d'
    DateTime.strptime(date_string, format).to_date
  end

end