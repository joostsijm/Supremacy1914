"""change column case

Revision ID: c18cd94914ec
Revises: 559b443f7974
Create Date: 2017-10-28 00:56:48.131208

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c18cd94914ec'
down_revision = '559b443f7974'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('sp_players', sa.Column('name', sa.String(), nullable=False))
    op.add_column('sp_players', sa.Column('title', sa.String(), nullable=True))
    op.drop_column('sp_players', 'Title')
    op.drop_column('sp_players', 'Name')


def downgrade():
    op.add_column('sp_players', sa.Column('Name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('sp_players', sa.Column('Title', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('sp_players', 'title')
    op.drop_column('sp_players', 'name')
