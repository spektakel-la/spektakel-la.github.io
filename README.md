# Spektakel LA

This is the Jekyll-based website for the buskers festival "Spektakel Landshut" in the south of Germany.

This website is build on top of the fantastic [Millenial](https://github.com/lenpaul/Millennial) Jekyll theme. So please head over there for build-instructions, etc.

## Setting Up Local Development Environment

To develop the website locally, you need a Ruby environment with the correct version compatible with GitHub Pages. Follow these steps:

### Installing Ruby Environment with rbenv

1. **Install rbenv and ruby-build**:

   ```bash
   # Installation with Homebrew (macOS)
   brew install rbenv ruby-build

   # Add rbenv to your shell startup
   echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **Install Ruby** (The project uses a specific Ruby version defined in `.ruby-version`):

   ```bash
   # Navigate to the project directory
   cd /path/to/spektakel-la.github.io

   # Check which Ruby version is required (defined in .ruby-version)
   cat .ruby-version

   # Install the required Ruby version (rbenv reads the .ruby-version file)
   rbenv install

   # Verify the correct Ruby version is being used
   ruby -v
   ```

### Installing Jekyll and Dependencies

3. **Install Bundler**:

   ```bash
   gem install bundler
   ```

4. **Install Dependencies**:

   ```bash
   bundle install
   ```

### Starting the Local Server

5. **Start Jekyll Server**:

   ```bash
   bundle exec jekyll serve
   ```

   The website will be available at http://127.0.0.1:4000.

### Notes on SCSS Files

When using modern CSS syntax in SCSS files (like `rgb(0 0 0 / 80%)`), you should use the older syntax `rgba(0, 0, 0, 0.8)` instead, as the GitHub Pages version of Jekyll doesn't yet support all newer CSS features.

## Credits
Kudos to the original authors and contributors of Millenial.
