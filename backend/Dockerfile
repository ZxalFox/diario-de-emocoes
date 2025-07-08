# Use a imagem padrão do Ruby baseada em Debian (Bookworm)
FROM ruby:3.2

# Instala as dependências do sistema necessárias.
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    nodejs \
    npm \
    tzdata \
    libyaml-dev \
    libxml2-dev && \
    rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho.
WORKDIR /app

# CORREÇÃO: Configura o Bundler para instalar as gems em um local separado.
ENV BUNDLE_PATH /usr/local/bundle
# A linha BUNDLE_WITHOUT foi removida para garantir que as gems de desenvolvimento sejam instaladas.

# Copia os arquivos de dependência primeiro para aproveitar o cache do Docker.
COPY Gemfile Gemfile.lock ./

# Instala TODAS as gems, incluindo as de desenvolvimento.
RUN bundle install

# Copia o restante do código da sua aplicação.
COPY . .

# Expõe a porta que o servidor Rails irá usar.
EXPOSE 3001

# Define o comando padrão para iniciar o servidor Rails.
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3001"]
