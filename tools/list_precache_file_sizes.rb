#!/usr/bin/env ruby
require 'json'

# Pfad zur sw.js Datei
sw_js_path = File.expand_path('../_site/sw.js', __dir__)
site_dir = File.expand_path('../_site', __dir__)

# sw.js einlesen
sw_js = File.read(sw_js_path)

# Array extrahieren (grob, da kein valides JSON)
array_match = sw_js.match(/precacheAndRoute\((\[.*?\])\s*\|\| \[\]/m)
raise 'precacheAndRoute Array nicht gefunden!' unless array_match
array_str = array_match[1]

# JSON parsen
begin
  precache = JSON.parse(array_str)
rescue => e
  abort "Fehler beim Parsen des Arrays: #{e}"
end

# Dateigrößen sammeln
files = precache.map do |entry|
  url = entry['url']
  file_path = File.join(site_dir, url)
  if File.exist?(file_path)
    size = File.size(file_path)
    { url: url, size: size }
  else
    { url: url, size: nil }
  end
end

# Nur vorhandene Dateien, nach Größe sortiert (absteigend)
files = files.select { |f| f[:size] }.sort_by { |f| -f[:size] }

# Ausgabe
puts "Dateigrößen der precache-Dateien (_site):"
def human_size(bytes)
  units = %w[B KB MB GB TB]
  return "0 B" if bytes.nil? || bytes == 0
  exp = (Math.log(bytes) / Math.log(1024)).to_i
  exp = units.size - 1 if exp > units.size - 1
  val = bytes.to_f / (1024 ** exp)
  if exp == 0
    "%d B" % bytes
  else
    "%.1f %s" % [val, units[exp]]
  end
end

files.each do |f|
  puts "%8s  %s" % [human_size(f[:size]), f[:url]]
end
