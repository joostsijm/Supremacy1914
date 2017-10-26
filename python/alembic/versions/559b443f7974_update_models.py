"""update models

Revision ID: 559b443f7974
Revises: 71fbddb471e7
Create Date: 2017-10-25 20:30:43.253170

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '559b443f7974'
down_revision = '71fbddb471e7'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('sp_maps', sa.Column('map_id', sa.Integer(), nullable=True))
    op.add_column('sp_relations', sa.Column('player_native_id', sa.Integer(), nullable=True))
    op.drop_constraint('sp_relations_player1_native_id_fkey', 'sp_relations', type_='foreignkey')
    op.create_foreign_key(None, 'sp_relations', 'sp_players', ['player_native_id'], ['id'])
    op.drop_column('sp_relations', 'player1_native_id')


def downgrade():
    op.add_column('sp_relations', sa.Column('player1_native_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'sp_relations', type_='foreignkey')
    op.create_foreign_key('sp_relations_player1_native_id_fkey', 'sp_relations', 'sp_players', ['player1_native_id'], ['id'])
    op.drop_column('sp_relations', 'player_native_id')
    op.drop_column('sp_maps', 'map_id')
