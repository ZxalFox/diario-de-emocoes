class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :message, null: false
      t.string :notification_type, null: false
      t.boolean :read, default: false
      t.timestamps
    end
    
    add_index :notifications, [:user_id, :read]
    add_index :notifications, :notification_type
  end
end