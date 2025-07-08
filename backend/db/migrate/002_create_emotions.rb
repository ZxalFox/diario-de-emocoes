class CreateEmotions < ActiveRecord::Migration[7.0]
  def change
    create_table :emotions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :emotion_type, null: false
      t.integer :mood_score, null: false
      t.text :description
      t.datetime :recorded_at, null: false
      t.timestamps
    end
    
    add_index :emotions, [:user_id, :recorded_at]
    add_index :emotions, :emotion_type
  end
end