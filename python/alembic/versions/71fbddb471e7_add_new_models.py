"""add new models

Revision ID: 71fbddb471e7
Revises: e6fcb1b75183
Create Date: 2017-10-25 16:39:40.852509

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '71fbddb471e7'
down_revision = 'e6fcb1b75183'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('sp_coalitions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('coaliton_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['sp_games.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sp_players',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('player_id', sa.Integer(), nullable=True),
    sa.Column('start_day', sa.Integer(), nullable=True),
    sa.Column('Title', sa.String(), nullable=True),
    sa.Column('Name', sa.String(), nullable=False),
    sa.Column('nation_name', sa.String(), nullable=False),
    sa.Column('primary_color', sa.String(), nullable=True),
    sa.Column('secondary_color', sa.String(), nullable=True),
    sa.Column('defeated', sa.Boolean(), nullable=True),
    sa.Column('last_login', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['sp_games.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['sp_users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sp_days',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('day', sa.Integer(), nullable=True),
    sa.Column('points', sa.Integer(), nullable=True),
    sa.Column('player_id', sa.Integer(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.Column('coalition_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['coalition_id'], ['sp_coalitions.id'], ),
    sa.ForeignKeyConstraint(['game_id'], ['sp_games.id'], ),
    sa.ForeignKeyConstraint(['player_id'], ['sp_players.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sp_relations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('start_day', sa.Integer(), nullable=True),
    sa.Column('relation', sa.Integer(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.Column('player1_native_id', sa.Integer(), nullable=True),
    sa.Column('player_foreign_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['sp_games.id'], ),
    sa.ForeignKeyConstraint(['player1_native_id'], ['sp_players.id'], ),
    sa.ForeignKeyConstraint(['player_foreign_id'], ['sp_players.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('sp_games', sa.Column('game_host', sa.String(), nullable=True))


def downgrade():
    op.drop_column('sp_games', 'game_host')
    op.drop_table('sp_relations')
    op.drop_table('sp_days')
    op.drop_table('sp_players')
    op.drop_table('sp_coalitions')
