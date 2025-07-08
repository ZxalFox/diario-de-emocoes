# Este é o arquivo base para todos os modelos da sua aplicação.
# Ele herda de ActiveRecord::Base e fornece um ponto central para
# adicionar configurações ou métodos que se aplicam a todos os modelos.

class ApplicationRecord < ActiveRecord::Base
  # Define esta classe como abstrata, o que significa que você não
  # pode criar uma instância direta dela. Ela serve apenas para ser herdada.
  primary_abstract_class
end
