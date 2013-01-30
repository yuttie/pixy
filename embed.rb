#!/usr/bin/ruby

require 'base64'
require 'nokogiri'

html_fp = ARGV.shift
doc = Nokogiri::HTML.parse(open(html_fp))
doc.xpath('./html/head/link').remove
doc.xpath('./html/head/script').remove
ARGV.each do |fp|
  head = doc.at('./html/head')
  encoded = Base64.strict_encode64(IO.read(fp))
  case File.extname(fp)
  when '.css'
    head.add_child('<link rel="stylesheet" href="data:text/css;base64,%s" type="text/css" media="all">' % encoded)
  when '.js'
    head.add_child('<script src="data:text/javascript;base64,%s"></script>' % encoded)
  end
end
puts(doc.to_html)
