# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "spektakel-la"
  spec.version       = "1.0.0"
  spec.authors       = ["Me himself"]
  spec.email         = ["none@of-your-business.com"]

  spec.summary       = "A Jekyll website, based on millenial"
  spec.homepage      = "https://github.com/spektakel-la"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README|CHANGELOG)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.3"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.17"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.4"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.8"

end
